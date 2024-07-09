const express = require("express");
const router = express.Router();
const { ensureAdmin } = require("../middleware/checkAuth");
const userController = require("../controllers/userController");

// Admin Dashboard Route
router.get("/", ensureAdmin, (req, res) => {
    const store = req.sessionStore;
    store.all((err, sessions) => {
        const userSessions = [];
        for (const [sessionId, sessionData] of Object.entries(sessions)) {
            if (sessionData.passport && sessionData.passport.user && sessionData.passport.user.userrole != 'admin') {
                userSessions.push({
                    sessionId: sessionId,
                    userId: sessionData.passport.user.userid,
                    userRole: sessionData.passport.user.userrole
                });
            }
        }

        res.render("admin", { req: req, userSessions: userSessions });
    })
});

router.post("/revoke", ensureAdmin, async (req, res) => {
    const { sessionId, userId } = req.body;
    const store = req.sessionStore;

    if (!sessionId) {
        return res.status(400).json({ success: false, message: "Session ID is required." });
    }

    try {
        const revokeUser = userController.getUserById(parseInt(userId));
        if (!revokeUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // If the user has a GitHub token, attempt to revoke it
        if (revokeUser.login === 'github' && revokeUser.token) {
            const authHeader = `Basic ${Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString('base64')}`;
            const response = await fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: 'revokeUser.token' })
            });

            if (response.status !== 204) {
                throw new Error(`Failed to revoke GitHub session. Status: ${response.status}`);
            }
        }

        // Destroy the session in the session store
        await new Promise((resolve, reject) => {
            store.destroy(sessionId, err => {
                if (err) {
                    reject(new Error(`Failed to destroy session: ${err.message}`));
                } else {
                    resolve();
                }
            });
        });

        // If all operations were successful
        return res.status(200).json({ success: true, message: "Session successfully revoked." });

    } catch (error) {
        console.error('Error revoking session:', error);
        return res.status(500).json({ success: false, message: error.message || "Failed to revoke session." });
    }
});


module.exports = router;

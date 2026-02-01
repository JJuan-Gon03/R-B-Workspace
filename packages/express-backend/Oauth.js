import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Start OAuth
router.get("/google", (req, res, next) => {
  const mode = req.query.mode === "register" ? "register" : "signin";
  req.session.oauthMode = mode;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
});

// OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  async (req, res) => {
    const mode = req.session.oauthMode || "signin";
    const user = req.user;

    const token = jwt.sign(
      { sub: user.googleId, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store JWT in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontend}/homepage`);
  }
);

router.get("/failure", (req, res) => {
  res.status(401).send("Google authentication failed.");
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  req.logout?.(() => {});
  res.json({ ok: true });
});

export default router;

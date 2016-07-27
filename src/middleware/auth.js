export function requireAdmin(req, res, next) {
  if (!req.user.admin) {
    res.sendStatus(404);
  }
  next();
}

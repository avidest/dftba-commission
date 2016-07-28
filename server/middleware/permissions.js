export default function checkPermissions(...roles) {
  if (Array.isArray(roles[0])) {
    roles = roles[0]
  }
  return (req, res, next)=> {
    if (req.user && req.user.role && ~roles.indexOf(req.user.role)) {
      return next()
    }
    res.sendStatus(401)
  }
}
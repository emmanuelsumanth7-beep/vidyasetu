// ISO 27001 (A.12.4.1) - Event Logging
// Administrator and operator logs shall be protected and regularly reviewed.
const auditLogger = (actionName, targetTable = null) => {
  return async (req, res, next) => {
    // We bind to res.on('finish') to ensure we only log if the action succeeded (or failed, which we can record).
    res.on('finish', async () => {
      try {
        const user = req.user;
        const prisma = req.prisma; // Injected via index.js
        if (!user || !prisma) return;

        // Determine success based on HTTP status
        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
        const actionPrefix = isSuccess ? 'SUCCESS' : 'FAILURE';
        
        // Log to database
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: `${actionPrefix}_${actionName} [IP: ${req.ip}]`,
            targetTable: targetTable,
            targetId: req.params.id || req.body.id || null, // Best effort to capture ID
          }
        });
      } catch (err) {
        console.error('Audit Log failed to write:', err);
      }
    });
    
    next();
  };
};

module.exports = {
  auditLogger
};

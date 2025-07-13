import { Request, Response, NextFunction } from 'express';

export type Permission = 'Admin' | 'Operator' | 'Customer';

// Configuração da hierarquia de permissões
const PERMISSION_HIERARCHY: Record<Permission, number> = {
  'Admin': 3,    // Nível mais alto - acesso total
  'Operator': 2, // Nível médio - acesso limitado
  'Customer': 1  // Nível mais baixo - acesso básico
};

/**
 * Verifica se um usuário tem permissão baseado na hierarquia
 * @param userRole - Role do usuário
 * @param requiredRole - Role mínima necessária
 * @returns true se o usuário tem permissão
 */
const hasPermission = (userRole: Permission, requiredRole: Permission): boolean => {
  return PERMISSION_HIERARCHY[userRole] >= PERMISSION_HIERARCHY[requiredRole];
};

/**
 * Middleware para verificar permissões hierárquicas
 * @param requiredRole - Role mínima necessária para acessar a rota
 * @returns Middleware function
 */
export const requireRole = (requiredRole: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!(req as any).user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const user = (req as any).user;

      if (!hasPermission(user.role, requiredRole)) {
        res.status(403).json({
          success: false,
          message: 'Acesso negado. Permissões insuficientes.',
          requiredRole,
          userRole: user.role,
          hierarchy: PERMISSION_HIERARCHY
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

export const requirePermissions = {
  Admin: requireRole('Admin'),
  Operator: requireRole('Operator'),
  Customer: requireRole('Customer')
} as const;

/**
 * Função utilitária para adicionar novas permissões no futuro
 * @param newPermission - Nova permissão a ser adicionada
 * @param hierarchyLevel - Nível hierárquico (1 = mais baixo, 3+ = mais alto)
 */
export const addNewPermission = (newPermission: string, hierarchyLevel: number) => {
  console.log(`Nova permissão adicionada: ${newPermission} com nível ${hierarchyLevel}`);
}; 
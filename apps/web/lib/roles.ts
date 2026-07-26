export type UserRole = 'customer' | 'waiter' | 'chef' | 'manager' | 'owner';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  customer: 0,
  waiter: 1,
  chef: 1,
  manager: 2,
  owner: 3,
};

export function hasMinRole(userRole: string | null | undefined, minRole: UserRole): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as UserRole];
  const requiredLevel = ROLE_HIERARCHY[minRole];
  if (userLevel === undefined || requiredLevel === undefined) return false;
  return userLevel >= requiredLevel;
}

export function canAccessStaff(userRole: string | null | undefined): boolean {
  return hasMinRole(userRole, 'waiter');
}

export function canManage(userRole: string | null | undefined): boolean {
  return hasMinRole(userRole, 'manager');
}

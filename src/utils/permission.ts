export const hasPermission = (
  userPermissions: string[],
  required: string | string[]
): boolean => {
  if (!userPermissions || userPermissions.length === 0) return false;

  const list = Array.isArray(required) ? required : [required];

  if (userPermissions.includes("all:all")) return true;

  return list.some((perm) => userPermissions.includes(perm));
};

export const generateSidebarMenu = (permissions: string[]) => {
  return permissions
    .filter((p) => p.endsWith(":read"))
    .map((p) => {
      const [resource] = p.split(":");

      return {
        key: resource,
        label: toTitle(resource),
        path: `/${resource}`,
      };
    });
};

const toTitle = (text: string) => {
  return text
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
};

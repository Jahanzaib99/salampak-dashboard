export const isPermission = (userType, moduleName) => {
    return ((userType !== 'superAdmin' && userType !== 'vendor') || ((moduleName === 'event' || moduleName === 'trip') && userType === 'vendor'))
}

export default function truncateEntityID(entityID = '') {
  return entityID.length <= 16
    ? entityID
    : `${entityID.substr(0, 8)} ... ${entityID.substr(-8)}`
}

module.exports = (id) => {
  if (typeof id === 'string') {
    const idStringToNum = Number(id);
    if (isNaN(idStringToNum)) {
      throw new Error('Client gave id that cannot be parsed to a valid Number');
    }
    return idStringToNum;
  }
  if (typeof id === 'number') return id;
  throw new Error('Client given id cannot be parsed to valid Number');
};

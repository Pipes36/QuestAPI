module.exports = {
  id: (id = '') => {
    if (!id && id !== 0) {
      throw new Error('No ID Provided. Cannot create ID');
    }
    return Number(id);
  },
  productID: (id = '') => {
    if (!id && id !== 0) {
      throw new Error('No ID Provided. Cannot create product_id');
    }
    return id;
  },
  body: (body = '') => {
    if (!body) {
      return {};
    }
    if (typeof body === 'string') return body;
    if (typeof body !== 'string') return String(body);
  },
  date: (date) => {
    date = !date ? new Date() : date;
    return new Date (Date(date));
  },
  name: (name = 'User') => {
    if (!name) {
      return 'User';
    }
    if (typeof name === 'string') return name;
    if (typeof name !== 'string') return String(name);
  },
  email: (email) => {
    if (!email) {
      return '';
    }
    if (typeof email === 'string') return email;
    if (typeof email !== 'string') return '';
  },
  reported: (report) => {
    if (report === '1') {
      return true;
    }
    return false;
  },
  helpfulness: (score = 0) => {
    return Number(score);
  },
  // ANSWERS -----------------------------------
  photos: (photos) => {
    return Array.isArray(photos) ? photos : [];
  },
  // PHOTOS ------------------------------------
  url: (link) => {
    if (!link) return null;
    if (typeof link === 'string') return link;
  }
}
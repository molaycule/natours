class APIFeatures {
  constructor(query, queryStringObj) {
    this.query = query;
    this.queryStringObj = queryStringObj;
  }

  filter() {
    // 1a - filtering
    const queryObj = { ...this.queryStringObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((item) => delete queryObj[item]);

    // 1b - advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2 - sorting
    if (this.queryStringObj.sort) {
      const sortBy = this.queryStringObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 3 - field limiting
    if (this.queryStringObj.fields) {
      const fields = this.queryStringObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4 - pagination
    const page = +this.queryStringObj.page || 1;
    const limit = +this.queryStringObj.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

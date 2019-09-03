export default (store) => (next) => (action) => {
  //if (process.env.NODE_ENV === 'development') console.log(action);
  next(action);
};

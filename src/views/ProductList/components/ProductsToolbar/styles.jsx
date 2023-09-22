export default theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing()
  },
  spacer: {
    flexGrow: 1
  },
  searchInput: {
    marginRight: theme.spacing()
  }
});

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
  deleteButton: {
    color: theme.palette.danger.main,
    marginRight: theme.spacing()
  },
  importButton: {
    marginRight: theme.spacing()
  },
  importIcon: {
    marginRight: theme.spacing()
  },
  exportButton: {
    marginRight: theme.spacing()
  },
  exportIcon: {
    marginRight: theme.spacing()
  },
  searchInput: {
    marginRight: theme.spacing()
  }
});

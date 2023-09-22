export default theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    'overflow-x': 'hidden'
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '63px',
    flexShrink: 0
  },
  logoLink: {
    fontSize: 0
  },
  logoImage: {
    cursor: 'pointer',
    width: 200
  },
  logoDivider: {
    marginBottom: theme.spacing(2)
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: '100px',
    height: '100px'
  },
  nameText: {
    marginTop: theme.spacing(2)
  },
  bioText: {},
  profileDivider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  listSubheader: {
    color: theme.palette.text.secondary
  },
  withOutHoverListItem: {
    cursor: 'pointer',
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      borderRadius: '4px',
      '& $listItemIcon': {
        color: theme.palette.primary.main,
        marginLeft: '-4px'
      }
    },
    '& + &': {
      marginTop: theme.spacing()
    }
  },
  activeListItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.light,
    '& $listItemText': {
      color: theme.palette.text.primary
    },
    '& $listItemIcon': {
      color: theme.palette.primary.main,
      marginLeft: '-4px'
    }
  },
  listItemIcon: {
    marginRight: 0
  },
  listItemText: {
    fontWeight: 500,
    color: theme.palette.text.secondary
  },
  listDivider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  nested: {
    paddingLeft: theme.spacing(4),
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      borderRadius: '4px',
      '& $listItemIcon': {
        color: theme.palette.primary.main,
        marginLeft: '-4px'
      }
    },
    '& + &': {
      marginTop: theme.spacing()
    }
  },
  nestedActiveListItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.light,
    '& $listItemText': {
      color: theme.palette.text.primary
    },
    '& $listItemIcon': {
      color: theme.palette.primary.main,
      marginLeft: '-4px'
    }
  },
});

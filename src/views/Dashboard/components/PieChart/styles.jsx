import { Widgets } from "@material-ui/icons";

export default theme => ({
  root: {},
  refreshButton: {
    margin: -theme.spacing(2)
  },
  chartWrapper: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(),
    width: '33.33%'
  },
  deviceIcon: {
    color: theme.palette.common.neutral
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    height:'100%'
  }
});

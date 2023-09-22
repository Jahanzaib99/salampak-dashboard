export default theme => ({
  root: {},
  dropdownButton: {
    marginRight: -theme.spacing(2),
    '&:before': { borderBottom: "none" },
    '&:after': { borderBottom: "none" },
    '&:hover:not(.Mui-disabled):before': { borderBottom: "none" },
    fontSize:"1rem",
    color:"#000",
    margin:"0px 30px"
  },
  chartWrapper: {
    height: '400px',
    position: 'relative'
  },
  portletFooter: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

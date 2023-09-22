import environment from "../config/config";

const checkIsUserTokenInLocalStorage = () => {
    if (!localStorage.getItem("userToken")) {
        this.props.history.push(process.env.NODE_ENV === "development" ? "/"  : environment.production.prefix);
    }
  };
  export default checkIsUserTokenInLocalStorage;
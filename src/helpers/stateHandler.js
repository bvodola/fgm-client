class _ {
  static get(obj, prop) {
    let targetProp = obj;
    let propArray = prop.split(".");

    for (let i = 0; i < propArray.length; i++) {
      const currentProp = propArray[i];
      if (
        typeof targetProp === "undefined" ||
        typeof targetProp[currentProp] === "undefined"
      )
        return "";
      targetProp = targetProp[currentProp];
    }

    return targetProp;
  }

  static set(obj, path, value) {
    let schema = obj;
    const pathList = path.split(".");
    const len = pathList.length;

    for (let i = 0; i < len; i++) {
      const elem = pathList[i];
      const nextElem = i !== len - 1 ? pathList[i + 1] : undefined;
      const elemIsArray = isNaN(Number(nextElem)) ? false : true;

      if (typeof nextElem !== "undefined") {
        if (!schema[elem]) schema[elem] = elemIsArray ? [] : {};
        schema = schema[elem];
      } else {
        schema[elem] = value;
      }
    }
  }
}

class StateHandler {
  constructor(parent) {
    this.set = this.set.bind(parent);
    this.get = this.get.bind(parent);
  }

  get(name) {
    return _.get(this.state, name);
  }

  set(name, value, push = false) {
    let state = this.state;
    let nameArray = name.split(".");

    if (nameArray.length > 1) {
      if (push === true) {
        const oldValue = _.get(state, name);
        value = oldValue.concat(value);
      }
      _.set(state, name, value);
      let firstName = name.split(".")[0];
      this.setState({ [firstName]: state[firstName] });
    } else {
      this.setState({ [name]: value });
    }
  }
}

export { _ };
export default StateHandler;

const auth = require("../auth");
const { v4: uuidv4 } = require("uuid");
const TABLE = "user";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  function list() {
    return store.list(TABLE);
  }

  function get(id) {
    return store.get(TABLE, id);
  }

  async function upsert(body) {
    const user = { name: body.name, username: body.username };
    if (body.id) {
      user.id = body.id;
    } else {
      user.id = uuidv4();
    }

    if (body.username || body.password) {
      await auth.upsert({
        id: user.id,
        username: user.username,
        password: body.password,
      });
    }

    return store.upsert(TABLE, user);
  }

  function remove(id) {
    return store.get(TABLE, id);
  }

  return { list, get, upsert, remove };
};

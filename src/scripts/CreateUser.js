const sequelize = require("../config/database");
const User = require("../models/User");

(async () => {
  try {
    await sequelize.sync();

    const novoUsuario = await User.create({
      firstname: "Gabriel",
      surname: "Mendes",
      email: "gabriel@email.com",
      password: "123@123",
    });

    console.log("Usuário criado com sucesso:");
    console.log({
      id: novoUsuario.id,
      firstname: novoUsuario.firstname,
      surname: novoUsuario.surname,
      email: novoUsuario.email,
    });

    process.exit();
  } catch (error) {
    console.error("Erro ao criar usuário:", error.message || error);
    process.exit(1);
  }
})();

const AccesBD = require("./AccesBD");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

class Utilizator {
  constructor({
    id,
    username,
    nume,
    prenume,
    email,
    parola,
    data_nasterii,
    data_inregistrarii,
    culoare_chat = "black",
    rol = "comun",
    problema_vedere = false,
    fotografie = null,
  }) {
    this.id = id;
    this.username = username;
    this.nume = nume;
    this.prenume = prenume;
    this.email = email;
    this.parola = parola;
    this.data_nasterii = data_nasterii;
    this.data_inregistrarii = data_inregistrarii || new Date();
    this.culoare_chat = culoare_chat;
    this.rol = rol;
    this.problema_vedere = problema_vedere;
    this.fotografie = fotografie;
  }

  static async getUtilizDupaUsername(username, callback) {
    const accesBD = AccesBD.getInstanta();
    const query = {
      tabel: "utilizatori",
      campuri: ["*"],
      conditii: [`username='${username}'`],
    };
    try {
      const res = await accesBD.selectAsync(query);
      if (res.length > 0) {
        const utilizator = new Utilizator(res[0]);
        callback(null, utilizator);
      } else {
        callback(new Error("User not found"), null);
      }
    } catch (err) {
      callback(err, null);
    }
  }

  static async getUtilizDupaUsernameAsync(username) {
    const accesBD = AccesBD.getInstanta();
    const query = {
      tabel: "utilizatori",
      campuri: ["*"],
      conditii: [`username='${username}'`],
    };
    try {
      const res = await accesBD.selectAsync(query);
      if (res.length > 0) {
        return new Utilizator(res[0]);
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  async salvareUtilizator() {
    const accesBD = AccesBD.getInstanta();
    const query = {
      tabel: "utilizatori",
      campuri: [
        "username",
        "nume",
        "prenume",
        "email",
        "parola",
        "data_nasterii",
        "data_inregistrarii",
        "culoare_chat",
        "rol",
        "problema_vedere",
        "fotografie",
      ],
      valori: [
        this.username,
        this.nume,
        this.prenume,
        this.email,
        this.parola,
        this.data_nasterii,
        this.data_inregistrarii,
        this.culoare_chat,
        this.rol,
        this.problema_vedere,
        this.fotografie,
      ],
    };
    try {
      await accesBD.insert(query, (err, res) => {
        if (err) {
          throw err;
        }
        return res[0];
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Utilizator;

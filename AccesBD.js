const { Client } = require("pg");

class AccesBD {
  static instanta = null;

  constructor() {
    if (AccesBD.instanta) {
      throw new Error("Instanța deja creată!");
    }
    this.client = new Client({
      user: "postgres",
      host: "localhost",
      database: "tw",
      password: "flacara123",
      port: 5432,
    });
    this.client.connect();
    AccesBD.instanta = this;
  }

  static getInstanta() {
    if (!AccesBD.instanta) {
      AccesBD.instanta = new AccesBD();
    }
    return AccesBD.instanta;
  }

  async select(obiect, callback) {
    try {
      let text = `SELECT ${obiect.campuri.join(",")} FROM ${obiect.tabel}`;
      if (obiect.conditii) {
        text += ` WHERE ${obiect.conditii.join(" AND ")}`;
      }
      const res = await this.client.query(text);
      callback(null, res.rows);
    } catch (err) {
      callback(err, null);
    }
  }

  async selectAsync(obiect) {
    try {
      let text = `SELECT ${obiect.campuri.join(",")} FROM ${obiect.tabel}`;
      if (obiect.conditii) {
        text += ` WHERE ${obiect.conditii.join(" AND ")}`;
      }
      const res = await this.client.query(text);
      return res.rows;
    } catch (err) {
      throw err;
    }
  }

  async insert(obiect, callback) {
    try {
      let text = `INSERT INTO ${obiect.tabel} (${obiect.campuri.join(
        ","
      )}) VALUES (${obiect.valori
        .map((_, i) => `$${i + 1}`)
        .join(",")}) RETURNING *`;
      const res = await this.client.query(text, obiect.valori);
      if (callback) {
        callback(null, res.rows);
      }
    } catch (err) {
      if (callback) {
        callback(err, null);
      } else {
        throw err;
      }
    }
  }

  async update(obiect, callback) {
    try {
      let text = `UPDATE ${obiect.tabel} SET ${obiect.campuri
        .map((camp, i) => `${camp} = $${i + 1}`)
        .join(",")} WHERE ${obiect.conditii.join(" AND ")}`;
      const res = await this.client.query(text, obiect.valori);
      callback(null, res);
    } catch (err) {
      callback(err, null);
    }
  }

  async delete(obiect, callback) {
    try {
      let text = `DELETE FROM ${obiect.tabel} WHERE ${obiect.conditii.join(
        " AND "
      )}`;
      const res = await this.client.query(text);
      callback(null, res);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = AccesBD;

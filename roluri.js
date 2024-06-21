const Drepturi = require("./drepturi");

/**
 * Clasa de bază Rol
 */

class Rol {
  constructor(cod) {
    this.cod = cod;
  }

  get drepturi() {
    return [];
  }

  /**
   * @param {Symbol} drept - Dreptul de verificat
   * @returns {boolean} - True dacă are dreptul, altfel False
   */

  areDreptul(drept) {
    return this.drepturi.includes(drept);
  }
}

class RolClient extends Rol {
  constructor() {
    super("comun");
  }

  get drepturi() {
    return [Drepturi.VIZUALIZARE_PRODUSE];
  }
}

class RolAdmin extends Rol {
  constructor() {
    super("admin");
  }

  get drepturi() {
    return Object.values(Drepturi);
  }
}

class RolModerator extends Rol {
  constructor() {
    super("moderator");
  }

  get drepturi() {
    return [
      Drepturi.VIZUALIZARE_UTILIZATORI,
      Drepturi.MODIFICARE_UTILIZATORI,
      Drepturi.STERGERE_UTILIZATORI,
    ];
  }
}

class RolFactory {
  static creeazaRol(tip) {
    switch (tip) {
      case "comun":
        return new RolClient();
      case "admin":
        return new RolAdmin();
      case "moderator":
        return new RolModerator();
      default:
        throw new Error(`Tipul de rol ${tip} nu este definit`);
    }
  }
}

module.exports = { Rol, RolClient, RolAdmin, RolModerator, RolFactory };

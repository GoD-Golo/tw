/**
 * Obiect Drepturi cu simboluri pentru diferite drepturi
 */

const Drepturi = {
  VIZUALIZARE_UTILIZATORI: Symbol("vizualizare_utilizatori"),
  MODIFICARE_UTILIZATORI: Symbol("modificare_utilizatori"),
  STERGERE_UTILIZATORI: Symbol("stergere_utilizatori"),
  ADAUGARE_PRODUSE: Symbol("adaugare_produse"),
  VIZUALIZARE_PRODUSE: Symbol("vizualizare_produse"),
  MODIFICARE_PRODUSE: Symbol("modificare_produse"),
  STERGERE_PRODUSE: Symbol("stergere_produse"),
};

module.exports = Drepturi;

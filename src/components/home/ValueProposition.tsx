import "./ValueProposition.css";

interface ValuePromise {
  title: string;
  text: string;
}

const PROMISES: ValuePromise[] = [
  {
    title: "Vista",
    text: "Cada residencia tiene algo que mirar: el valle desde Escazú, la ciudad desde Santa Ana o el Pacífico desde Guanacaste.",
  },
  {
    title: "Privacidad",
    text: "Accesos controlados, ascensores privados y espacios sin vecinos encima. Tu casa no se comparte.",
  },
  {
    title: "Acompañamiento",
    text: "Una sola persona te atiende de principio a fin: agenda la visita, resuelve el contrato y te entrega las llaves.",
  },
];

function ValueProposition() {
  return (
    <section className="value" aria-labelledby="value-title">
      <div className="value__inner">
        <div className="value__intro">
          <h2 id="value-title" className="value__title">
            Lo que te prometemos
          </h2>
          <p className="value__lead">
            No competimos por cantidad. Cada residencia del catálogo cumple tres
            condiciones antes de llevar nuestro nombre.
          </p>
          <figure className="value__photo">
            <img
              src="/images/home/valor-ventanal.jpg"
              alt="Ventanal que enmarca el mar turquesa y un jardín con flores"
              loading="lazy"
            />
          </figure>
        </div>

        <ul className="value__list">
          {PROMISES.map((promise) => (
            <li className="value__item" key={promise.title}>
              <h3 className="value__name">{promise.title}</h3>
              <p className="value__text">{promise.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ValueProposition;

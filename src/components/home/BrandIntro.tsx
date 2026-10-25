import "./BrandIntro.css";

function BrandIntro() {
  return (
    <section className="brand-intro" aria-labelledby="brand-intro-title">
      <div className="brand-intro__inner">
        <div className="brand-intro__text">
          <h2 id="brand-intro-title" className="brand-intro__title">
            Lujo que se cuida como una guaria
          </h2>

          <p className="brand-intro__statement">
            La guaria morada, flor nacional de Costa Rica, florece una vez al
            año y se cuida el resto del tiempo. Así tratamos cada residencia:
            pocas, elegidas y atendidas de cerca.
          </p>

          <div className="brand-intro__columns">
            <p>
              Residencias La Guaria es una agencia costarricense de alquiler de
              residencias de lujo. Reunimos penthouses, apartamentos y casas en
              Escazú, Santa Ana, Curridabat, Guanacaste y Jacó.
            </p>
            <p>
              Visitamos cada propiedad antes de publicarla y acompañamos a cada
              familia desde la primera visita hasta la entrega de llaves.
            </p>
          </div>
        </div>

        <div className="brand-intro__photos">
          <figure className="brand-intro__photo brand-intro__photo--main">
            <img
              src="/images/home/intro-atardecer.jpg"
              alt="Sala con ventanales de piso a techo frente al mar al atardecer"
              loading="lazy"
            />
          </figure>
          <figure className="brand-intro__photo brand-intro__photo--small">
            <img
              src="/images/home/intro-ladera.jpg"
              alt="Casa moderna entre árboles tropicales en una ladera"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

export default BrandIntro;

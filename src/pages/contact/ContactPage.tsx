import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

function ContactPage() {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    propiedad: searchParams.get("propiedad") ?? "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setEnviado(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnviado(true);
  };

  return (
    <main className="contact-page">
      <section className="contact-header">
        <h1>Tu próximo hogar comienza aquí</h1>
        <p>Contáctanos para acordar una visita a nuestros apartamentos.</p>
      </section>

      <section className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="propiedad">Propiedad de interés</label>
            <input
              id="propiedad"
              name="propiedad"
              type="text"
              value={form.propiedad}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              rows={5}
              required
              minLength={10}
            />
          </div>

          <button className="contact-button" type="submit">
            Enviar consulta
          </button>

          {enviado && (
            <p className="form-success" role="status">
              Formulario validado.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default ContactPage;

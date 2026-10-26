import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import "./ContactPage.css";

interface ContactForm {
  nombre: string;
  correo: string;
  telefono: string;
  propiedad: string;
  mensaje: string;
}

type FormErrors = Partial<Record<keyof ContactForm, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s-]{8,}$/;

// Revisa los campos en el orden del formulario y devuelve un mensaje por cada error
function validate(form: ContactForm): FormErrors {
  const errors: FormErrors = {};

  if (form.nombre.trim().length < 2) {
    errors.nombre = "Escribe tu nombre completo.";
  }

  if (form.correo.trim() === "") {
    errors.correo = "Necesitamos tu correo para responderte.";
  } else if (!EMAIL_PATTERN.test(form.correo.trim())) {
    errors.correo = "Revisa el correo: debe verse como nombre@dominio.com.";
  }

  if (form.telefono.trim() !== "" && !PHONE_PATTERN.test(form.telefono.trim())) {
    errors.telefono = "Revisa el teléfono: usa solo números, mínimo 8.";
  }

  if (form.mensaje.trim().length < 10) {
    errors.mensaje = "Cuéntanos un poco más (mínimo 10 caracteres).";
  }

  return errors;
}

function ContactPage() {
  const [searchParams] = useSearchParams();
  const [propiedadInicial] = useState(searchParams.get("propiedad") ?? "");

  const [form, setForm] = useState<ContactForm>({
    nombre: "",
    correo: "",
    telefono: "",
    propiedad: propiedadInicial,
    mensaje: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const successTitleRef = useRef<HTMLHeadingElement>(null);

  // Al confirmar, el foco pasa al título para que el lector de pantalla lo anuncie
  useEffect(() => {
    if (enviado) {
      successTitleRef.current?.focus();
    }
  }, [enviado]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const field = name as keyof ContactForm;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

    setEnviado(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setEnviado(true);
  };

  const handleReset = () => {
    setForm({
      nombre: "",
      correo: "",
      telefono: "",
      propiedad: propiedadInicial,
      mensaje: "",
    });
    setErrors({});
    setEnviado(false);
  };

  const describedBy = (field: keyof ContactForm, extra?: string) =>
    [errors[field] ? `${field}-error` : "", extra ?? ""].filter(Boolean).join(" ") ||
    undefined;

  const propiedadPrellenada =
    propiedadInicial !== "" && form.propiedad === propiedadInicial;

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Tu próximo hogar comienza aquí</h1>
        <p>Contáctanos para acordar una visita a nuestros apartamentos.</p>
      </section>

      <section className="contact-content">
        {enviado ? (
          <div className="form-success">
            <h2 ref={successTitleRef} tabIndex={-1}>
              Gracias, {form.nombre.trim().split(" ")[0]}.
            </h2>
            <p>
              Tu consulta
              {form.propiedad.trim() !== "" && (
                <>
                  {" "}sobre <strong>{form.propiedad.trim()}</strong>
                </>
              )}{" "}
              quedó registrada. Pronto nos pondremos en contacto contigo.
            </p>
            <button className="form-success__again" type="button" onClick={handleReset}>
              Escribir otro mensaje
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder=" "
                autoComplete="name"
                aria-invalid={errors.nombre ? true : undefined}
                aria-describedby={describedBy("nombre")}
              />
              {errors.nombre && (
                <p className="form-error" id="nombre-error">{errors.nombre}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                placeholder=" "
                autoComplete="email"
                aria-invalid={errors.correo ? true : undefined}
                aria-describedby={describedBy("correo")}
              />
              {errors.correo && (
                <p className="form-error" id="correo-error">{errors.correo}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">
                Teléfono <span className="form-optional">(opcional)</span>
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder=" "
                autoComplete="tel"
                aria-invalid={errors.telefono ? true : undefined}
                aria-describedby={describedBy("telefono")}
              />
              {errors.telefono && (
                <p className="form-error" id="telefono-error">{errors.telefono}</p>
              )}
            </div>

            <div
              className={`form-group${propiedadPrellenada ? " form-group--prefilled" : ""}`}
            >
              <label htmlFor="propiedad">Propiedad de interés</label>
              <input
                id="propiedad"
                name="propiedad"
                type="text"
                value={form.propiedad}
                onChange={handleChange}
                placeholder=" "
                aria-describedby={propiedadPrellenada ? "propiedad-nota" : undefined}
              />
              {propiedadPrellenada && (
                <p className="form-group__note" id="propiedad-nota">
                  Elegida desde la ficha de la residencia
                </p>
              )}
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={5}
                placeholder=" "
                aria-invalid={errors.mensaje ? true : undefined}
                aria-describedby={describedBy("mensaje")}
              />
              {errors.mensaje && (
                <p className="form-error" id="mensaje-error">{errors.mensaje}</p>
              )}
            </div>

            <button className="contact-button" type="submit">
              Enviar consulta <span className="contact-button__arrow" aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default ContactPage;

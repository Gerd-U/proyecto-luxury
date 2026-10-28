import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import VisitCard from "../../components/contact/VisitCard";
import { useApartments } from "../../hooks/useApartments";
import type { ContactForm, Motivo } from "../../types/contact";
import { MOTIVO_LABEL } from "../../types/contact";
import "./ContactPage.css";

type FormErrors = Partial<Record<keyof ContactForm, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s-]{8,}$/;

const MOTIVOS = Object.keys(MOTIVO_LABEL) as Motivo[];

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

  if (
    form.telefono.trim() !== "" &&
    !PHONE_PATTERN.test(form.telefono.trim())
  ) {
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
  const { apartments, isLoading } = useApartments();

  const formularioVacio: ContactForm = {
    nombre: "",
    correo: "",
    telefono: "",
    propiedad: propiedadInicial,
    motivo: "informacion",
    mensaje: "",
  };

  const [form, setForm] = useState<ContactForm>(formularioVacio);
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const successTitleRef = useRef<HTMLHeadingElement>(null);

  const apartamento = apartments.find((item) => item.name === form.propiedad);

  useEffect(() => {
    if (enviado) {
      successTitleRef.current?.focus();
    }
  }, [enviado]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0] as
      | keyof ContactForm
      | undefined;
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setEnviado(true);
  };

  const handleReset = () => {
    setForm(formularioVacio);
    setErrors({});
    setEnviado(false);
  };

  const describedBy = (field: keyof ContactForm, extra?: string) =>
    [errors[field] ? `${field}-error` : "", extra ?? ""]
      .filter(Boolean)
      .join(" ") || undefined;

  const propiedadPrellenada =
    propiedadInicial !== "" && form.propiedad === propiedadInicial;

  const propiedadFueraDeLista =
    form.propiedad !== "" && !isLoading && apartamento === undefined;

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Tu próximo hogar comienza aquí</h1>
        <p>Cuéntanos qué residencia te interesa y qué necesitas saber.</p>

        <VisitCard
          apartment={apartamento}
          nombre={form.nombre}
          motivo={form.motivo}
          confirmada={enviado}
        />
      </section>

      <section className="contact-content">
        {enviado ? (
          <div className="form-success">
            <h2 ref={successTitleRef} tabIndex={-1}>
              Gracias, {form.nombre.trim().split(/\s+/)[0]}.
            </h2>
            <p>
              <strong>Envío simulado.</strong> Este sitio es un proyecto académico:
              tu consulta no se mandó a ningún lado y nadie te va a contactar.
            </p>
            <button
              className="form-success__again"
              type="button"
              onClick={handleReset}
            >
              Escribir otro mensaje
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="form-choices form-group--full">
              <legend className="form-choices__legend">
                ¿En qué te ayudamos?
              </legend>
              <div className="form-choices__options">
                {MOTIVOS.map((motivo) => (
                  <label key={motivo} className="form-chip">
                    <input
                      className="form-chip__input"
                      type="radio"
                      name="motivo"
                      value={motivo}
                      checked={form.motivo === motivo}
                      onChange={handleChange}
                    />
                    <span className="form-chip__label">
                      {MOTIVO_LABEL[motivo]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div
              className={`form-group form-group--full form-group--select${propiedadPrellenada ? " form-group--prefilled" : ""}`}
            >
              <label htmlFor="propiedad">Residencia de interés</label>
              <select
                id="propiedad"
                name="propiedad"
                value={form.propiedad}
                onChange={handleChange}
                disabled={isLoading}
                aria-describedby={
                  propiedadPrellenada ? "propiedad-nota" : undefined
                }
              >
                <option value="">
                  {isLoading
                    ? "Cargando residencias…"
                    : "Aún no sé, quiero una recomendación"}
                </option>
                {propiedadFueraDeLista && (
                  <option value={form.propiedad}>{form.propiedad}</option>
                )}
                {apartments.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} · {item.location}
                  </option>
                ))}
              </select>
              {propiedadPrellenada && (
                <p className="form-group__note" id="propiedad-nota">
                  Elegida desde la ficha de la residencia
                </p>
              )}
            </div>

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
                <p className="form-error" id="nombre-error">
                  {errors.nombre}
                </p>
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
                <p className="form-error" id="correo-error">
                  {errors.correo}
                </p>
              )}
            </div>

            <div className="form-group form-group--full">
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
                <p className="form-error" id="telefono-error">
                  {errors.telefono}
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
                <p className="form-error" id="mensaje-error">
                  {errors.mensaje}
                </p>
              )}
            </div>

            <button className="contact-button" type="submit">
              Enviar consulta{" "}
              <span className="contact-button__arrow" aria-hidden="true">
                →
              </span>
            </button>

            <p className="form-demo-note">
              <strong>Envío simulado.</strong> Este formulario es de demostración:
              al enviarlo no se manda ningún dato.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}

export default ContactPage;

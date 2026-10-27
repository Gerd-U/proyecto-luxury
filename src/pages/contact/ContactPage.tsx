import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import VisitCard from "../../components/contact/VisitCard";
import { useApartments } from "../../hooks/useApartments";
import type { ContactForm, Horario, Motivo } from "../../types/contact";
import { HORARIO_LABEL, MOTIVO_LABEL } from "../../types/contact";
import "./ContactPage.css";

type FormErrors = Partial<Record<keyof ContactForm, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s-]{8,}$/;

const MOTIVOS = Object.keys(MOTIVO_LABEL) as Motivo[];
const HORARIOS = Object.keys(HORARIO_LABEL) as Exclude<Horario, "">[];

const FOCUS_ID: Partial<Record<keyof ContactForm, string>> = {
  horario: "horario-manana",
};

function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function validate(form: ContactForm): FormErrors {
  const errors: FormErrors = {};

  if (form.motivo === "visita") {
    if (form.fecha === "") {
      errors.fecha = "Elige el día en que te gustaría visitarla.";
    } else if (form.fecha < hoyISO()) {
      errors.fecha = "Esa fecha ya pasó: elige hoy o un día próximo.";
    }

    if (form.horario === "") {
      errors.horario = "Elige si prefieres la mañana o la tarde.";
    }
  }

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

  if (form.motivo !== "visita" && form.mensaje.trim().length < 10) {
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
    motivo: "visita",
    fecha: "",
    horario: "",
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
      document.getElementById(FOCUS_ID[firstInvalid] ?? firstInvalid)?.focus();
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
        <p>Cuéntanos qué residencia te interesa y cuándo quieres conocerla.</p>

        <VisitCard
          apartment={apartamento}
          nombre={form.nombre}
          motivo={form.motivo}
          fecha={form.fecha}
          horario={form.horario}
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
              {form.motivo === "visita"
                ? "Tu solicitud de visita quedó registrada. Te escribiremos para confirmar el día y la hora."
                : "Tu consulta quedó registrada. Pronto nos pondremos en contacto contigo."}
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

            {form.motivo === "visita" && (
              <div className="form-visit form-group--full">
                <div className="form-group">
                  <label htmlFor="fecha">Día de la visita</label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    min={hoyISO()}
                    value={form.fecha}
                    onChange={handleChange}
                    aria-invalid={errors.fecha ? true : undefined}
                    aria-describedby={describedBy("fecha")}
                  />
                  {errors.fecha && (
                    <p className="form-error" id="fecha-error">
                      {errors.fecha}
                    </p>
                  )}
                </div>

                <fieldset
                  className="form-choices"
                  aria-invalid={errors.horario ? true : undefined}
                  aria-describedby={describedBy("horario")}
                >
                  <legend className="form-choices__legend">Horario</legend>
                  <div className="form-choices__options">
                    {HORARIOS.map((horario) => (
                      <label key={horario} className="form-chip">
                        <input
                          id={`horario-${horario}`}
                          className="form-chip__input"
                          type="radio"
                          name="horario"
                          value={horario}
                          checked={form.horario === horario}
                          onChange={handleChange}
                        />
                        <span className="form-chip__label">
                          {HORARIO_LABEL[horario]}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.horario && (
                    <p className="form-error" id="horario-error">
                      {errors.horario}
                    </p>
                  )}
                </fieldset>
              </div>
            )}

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
              <label htmlFor="mensaje">
                Mensaje{" "}
                {form.motivo === "visita" && (
                  <span className="form-optional">(opcional)</span>
                )}
              </label>
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
              {form.motivo === "visita"
                ? "Solicitar visita"
                : "Enviar consulta"}{" "}
              <span className="contact-button__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default ContactPage;

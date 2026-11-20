
import { useState, useRef } from 'react'
import './App.css'
import { db } from './firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import SimpleReactValidator from 'simple-react-validator'

function App() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    tipoCliente: '',
    comentarios: '',
  })

  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [, actualizarVista] = useState(0)

  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: 'Este campo es obligatorio.',
        email: 'Ingresa un correo electrónico válido.',
      },
    })
  )

  function manejarCambio(e) {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value,
    })

    setMensaje('')
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setMensaje('')

    if (!validator.current.allValid()) {
      validator.current.showMessages()
      actualizarVista(valor => valor + 1)
      return
    }

    try {
      setGuardando(true)

      await addDoc(collection(db, 'clientes'), {
        ...formulario,
        fechaRegistro: Timestamp.now(),
      })

      setMensaje('¡Registro guardado correctamente en Firebase!')

      setFormulario({
        nombre: '',
        correo: '',
        telefono: '',
        fechaNacimiento: '',
        tipoCliente: '',
        comentarios: '',
      })

      validator.current.hideMessages()
      actualizarVista(valor => valor + 1)

    } catch (error) {
      console.error('Error al guardar el cliente:', error)
      setMensaje('No se pudo guardar el registro. Inténtalo nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="contenedor">
      <section className="formulario">
        <h1>Registro de Clientes</h1>

        <p>
          Completa los siguientes datos para registrar un cliente.
        </p>

        <form onSubmit={manejarEnvio} noValidate>

          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ingresa tu nombre"
          />
          {validator.current.message(
            'nombre',
            formulario.nombre,
            'required'
          )}

          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formulario.correo}
            onChange={manejarCambio}
            placeholder="ejemplo@correo.com"
          />
          {validator.current.message(
            'correo',
            formulario.correo,
            'required|email'
          )}

          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formulario.telefono}
            onChange={manejarCambio}
            placeholder="Ingresa tu teléfono"
          />
          {validator.current.message(
            'telefono',
            formulario.telefono,
            'required'
          )}

          <label htmlFor="fechaNacimiento">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formulario.fechaNacimiento}
            onChange={manejarCambio}
          />
          {validator.current.message(
            'fechaNacimiento',
            formulario.fechaNacimiento,
            'required'
          )}

          <label htmlFor="tipoCliente">Tipo de cliente</label>
          <select
            id="tipoCliente"
            name="tipoCliente"
            value={formulario.tipoCliente}
            onChange={manejarCambio}
          >
            <option value="">Selecciona una opción</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Frecuente">Frecuente</option>
            <option value="Premium">Premium</option>
          </select>
          {validator.current.message(
            'tipoCliente',
            formulario.tipoCliente,
            'required'
          )}

          <label htmlFor="comentarios">Comentarios</label>
          <textarea
            id="comentarios"
            name="comentarios"
            value={formulario.comentarios}
            onChange={manejarCambio}
            placeholder="Escribe tus comentarios"
            rows="4"
          />

          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Registrar cliente'}
          </button>

        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </section>
    </main>
  )
}

export default App

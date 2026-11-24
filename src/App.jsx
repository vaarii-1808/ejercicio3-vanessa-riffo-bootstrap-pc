
import { useState, useRef, useEffect } from 'react'
import './App.css'
import { db, auth, storage } from './firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import SimpleReactValidator from 'simple-react-validator'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function App() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    fechaNacimiento: '',
    tipoCliente: '',
    comentarios: '',
  })

  const [fotografia, setFotografia] = useState(null)
  const [vistaPrevia, setVistaPrevia] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [, actualizarVista] = useState(0)

  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: 'Este campo es obligatorio.',
        email: 'Ingresa un correo electrónico válido.',
        min: 'La contraseña debe tener al menos 6 caracteres.',
      },
    })
  )

  // Liberar la vista previa cuando cambia o se elimina la fotografía
  useEffect(() => {
    return () => {
      if (vistaPrevia) {
        URL.revokeObjectURL(vistaPrevia)
      }
    }
  }, [vistaPrevia])

  function manejarCambio(e) {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value,
    })

    setMensaje('')
  }

  function manejarFotografia(e) {
    const archivo = e.target.files[0]

    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      setMensaje('Selecciona un archivo de imagen válido.')
      e.target.value = ''
      return
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setMensaje('La imagen no debe superar los 5 MB.')
      e.target.value = ''
      return
    }

    setFotografia(archivo)
    setVistaPrevia(URL.createObjectURL(archivo))
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

      // Crear usuario en Firebase Authentication
      const credencial = await createUserWithEmailAndPassword(
        auth,
        formulario.correo,
        formulario.password
      )

      const uid = credencial.user.uid
      let urlFotografia = ''

      // Subir fotografía a Firebase Storage, si se seleccionó una
      if (fotografia) {
        const nombreArchivo = `perfil-${Date.now()}-${fotografia.name}`
        const rutaFotografia = `clientes/${uid}/${nombreArchivo}`

        const referenciaFotografia = ref(storage, rutaFotografia)

        await uploadBytes(referenciaFotografia, fotografia, {
          contentType: fotografia.type,
        })

        urlFotografia = await getDownloadURL(referenciaFotografia)
      }

      // Guardar información del cliente en Cloud Firestore
      await addDoc(collection(db, 'clientes'), {
        uid: uid,
        nombre: formulario.nombre,
        correo: formulario.correo,
        telefono: formulario.telefono,
        fechaNacimiento: formulario.fechaNacimiento,
        tipoCliente: formulario.tipoCliente,
        comentarios: formulario.comentarios,
        fechaRegistro: Timestamp.now(),
        fotografiaSeleccionada: fotografia ? fotografia.name : '',
        urlFotografia: urlFotografia,
      })

      setMensaje(
        fotografia
          ? '¡Cliente registrado correctamente en Authentication, Firestore y Storage!'
          : '¡Usuario registrado correctamente en Authentication y Firestore!'
      )

      setFormulario({
        nombre: '',
        correo: '',
        password: '',
        telefono: '',
        fechaNacimiento: '',
        tipoCliente: '',
        comentarios: '',
      })

      setFotografia(null)
      setVistaPrevia('')
      e.target.reset()

      validator.current.hideMessages()
      actualizarVista(valor => valor + 1)

    } catch (error) {
      console.error('Error al registrar usuario:', error)

      if (error.code === 'auth/email-already-in-use') {
        setMensaje('Este correo electrónico ya está registrado.')
      } else if (error.code === 'auth/weak-password') {
        setMensaje('La contraseña debe tener al menos 6 caracteres.')
      } else if (error.code === 'auth/invalid-email') {
        setMensaje('El correo electrónico no es válido.')
      } else if (error.code === 'permission-denied') {
        setMensaje('No tienes permisos para guardar los datos en Firestore.')
      } else if (
        error.code === 'storage/unauthorized' ||
        error.code === 'storage/unknown'
      ) {
        setMensaje(
          'No se pudo subir la fotografía. Revisa las reglas y la conexión de Firebase Storage.'
        )
      } else {
        setMensaje(
          'No se pudo completar el registro. Revisa la consola para más detalles.'
        )
      }

    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="contenedor">
      <section className="formulario">

        <h1>Registro de Clientes</h1>

        <p className="descripcion">
          Completa los siguientes datos para registrar un cliente.
        </p>

        <form onSubmit={manejarEnvio} noValidate>

          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre completo
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ingresa tu nombre"
            />
            <div className="text-danger small mt-1">
              {validator.current.message('nombre', formulario.nombre, 'required')}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="ejemplo@correo.com"
            />
            <div className="text-danger small mt-1">
              {validator.current.message('correo', formulario.correo, 'required|email')}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formulario.password}
              onChange={manejarCambio}
              placeholder="Crea una contraseña"
            />
            <div className="text-danger small mt-1">
              {validator.current.message('password', formulario.password, 'required|min:6')}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              className="form-control"
              id="telefono"
              name="telefono"
              value={formulario.telefono}
              onChange={manejarCambio}
              placeholder="Ingresa tu teléfono"
            />
            <div className="text-danger small mt-1">
              {validator.current.message('telefono', formulario.telefono, 'required')}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="fechaNacimiento" className="form-label">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className="form-control"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formulario.fechaNacimiento}
              onChange={manejarCambio}
            />
            <div className="text-danger small mt-1">
              {validator.current.message('fechaNacimiento', formulario.fechaNacimiento, 'required')}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="tipoCliente" className="form-label">
              Tipo de cliente
            </label>
            <select
              className="form-select"
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
            <div className="text-danger small mt-1">
              {validator.current.message('tipoCliente', formulario.tipoCliente, 'required')}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="fotografia" className="form-label">
              Fotografía de perfil
            </label>
            <input
              type="file"
              className="form-control"
              id="fotografia"
              accept="image/*"
              onChange={manejarFotografia}
            />
            <div className="form-text">
              Selecciona una imagen de máximo 5 MB.
            </div>
          </div>

          {vistaPrevia && (
            <div className="mb-3 text-center">
              <p className="form-label">
                Vista previa de la fotografía
              </p>
              <img
                src={vistaPrevia}
                alt="Vista previa del perfil"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="comentarios" className="form-label">
              Comentarios
            </label>
            <textarea
              className="form-control"
              id="comentarios"
              name="comentarios"
              value={formulario.comentarios}
              onChange={manejarCambio}
              placeholder="Escribe tus comentarios"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={guardando}
          >
            {guardando ? 'Registrando...' : 'Registrar cliente'}
          </button>

        </form>

        {mensaje && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {mensaje}
          </div>
        )}

      </section>
    </main>
  )
}

export default App

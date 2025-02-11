const ctx: Worker = self as any

ctx.addEventListener('message', (event) => {
  if (event.data === 'keepAlive') {
    // Realizar una tarea ligera para mantener el worker activo
    console.log('Keeping the worker alive')
  }
})

export function alertaSwet(mensaje, duration){
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: duration
      });
}
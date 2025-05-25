import Swal, { type SweetAlertOptions } from 'sweetalert2'
import { useI18n } from 'vue-i18n'

export function useNotification() {
  const { t } = useI18n()

  const options: SweetAlertOptions = {
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    toast: true,
    timerProgressBar: true,
  }

  const successToast = function (messages: string): void {
    Swal.fire({
      title: t('common.success'),
      icon: 'success',
      text: messages,
      ...options,
      iconColor: window.getComputedStyle(document.body).getPropertyValue('--color-success'),
      customClass: {
        timerProgressBar: '!bg-success',
      },
    })
  }

  const errorToast = function (messages: string): void {
    Swal.fire({
      title: t('common.error'),
      icon: 'error',
      text: messages,
      ...options,
      iconColor: window.getComputedStyle(document.body).getPropertyValue('--color-error'),
      customClass: {
        timerProgressBar: '!bg-error',
      },
    })
  }

  return {
    successToast,
    errorToast,
  }
}

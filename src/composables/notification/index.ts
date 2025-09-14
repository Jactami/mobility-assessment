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

  const successToast = (message: string) => {
    Swal.fire({
      title: t('common.success'),
      icon: 'success',
      text: message,
      ...options,
      iconColor: window.getComputedStyle(document.body).getPropertyValue('--color-success'),
      customClass: {
        popup: '!bg-surface !text-on-surface dark:!border dark:!border-outline',
        timerProgressBar: '!bg-success',
      },
    })
  }

  const errorToast = (message: string) => {
    Swal.fire({
      title: t('common.error'),
      icon: 'error',
      text: message,
      ...options,
      iconColor: window.getComputedStyle(document.body).getPropertyValue('--color-error'),
      customClass: {
        popup: '!bg-surface !text-on-surface dark:!border dark:!border-outline',
        timerProgressBar: '!bg-error',
      },
    })
  }

  const infoToast = async (message: string) => {
    Swal.fire({
      title: t('common.info'),
      icon: 'info',
      text: message,
      ...options,
      iconColor: window.getComputedStyle(document.body).getPropertyValue('--color-secondary'),
      customClass: {
        popup: '!bg-surface !text-on-surface dark:!border dark:!border-outline',
        timerProgressBar: '!bg-secondary',
      },
    })

    const dismiss = () => Swal.close()

    return { dismiss }
  }

  const loadingToast = async (message: string) => {
    Swal.fire({
      icon: 'info',
      text: message,
      ...options,
      timer: undefined, // disable auto-close
      didOpen: () => {
        Swal.showLoading()
      },
      iconColor: window.getComputedStyle(document.body).getPropertyValue('--color-secondary'),
      customClass: {
        popup: '!bg-surface !text-on-surface dark:!border dark:!border-outline',
      },
    })

    const dismiss = () => Swal.close()

    return { dismiss }
  }

  const confirmDialog = (message: string) => {
    return new Promise((resolve) => {
      let confirmResult = false
      Swal.fire({
        title: t('common.pleaseConfirm'),
        icon: 'question',
        text: message,
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        showCancelButton: true,
        showConfirmButton: true,
        didClose: () => resolve(confirmResult),
      }).then((result) => (confirmResult = result.value))
    })
  }

  return {
    successToast,
    errorToast,
    infoToast,
    loadingToast,
    confirmDialog,
  }
}

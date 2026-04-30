'use client'

export async function copyMessage(text: string) {
  await navigator.clipboard.writeText(text)
}

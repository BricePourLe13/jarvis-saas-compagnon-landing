'use client'

import { ChakraProvider } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { jarvisTheme } from '@/theme/jarvisTheme'

type ChakraProvidersProps = {
  children: ReactNode
}

export function ChakraProviders({ children }: ChakraProvidersProps) {
  return (
    <ChakraProvider theme={jarvisTheme}>
      {children}
    </ChakraProvider>
  )
}

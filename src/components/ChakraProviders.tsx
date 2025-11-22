'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { jarvisTheme } from '@/theme/jarvisTheme'
import type { ReactNode } from 'react'

interface ChakraProvidersProps {
  children: ReactNode;
}

export function ChakraProviders({ children }: ChakraProvidersProps) {
  return (
    <ChakraProvider theme={jarvisTheme}>
      {children}
    </ChakraProvider>
  )
}

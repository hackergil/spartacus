import { inject, InjectFlags, InjectionToken } from '@angular/core';
import { deepMerge } from './utils/deep-merge';

/**
 * Global Configuration injection token, can be used to inject configuration to any part of the app
 */
export const Config = new InjectionToken('Configuration', {
  providedIn: 'root',
  factory: () => deepMerge({}, inject(DefaultConfig), inject(RootConfig)),
});

export const DefaultConfig = new InjectionToken('DefaultConfiguration', {
  providedIn: 'root',
  factory: () =>
    deepMerge({}, ...(inject(DefaultConfigChunk, InjectFlags.Optional) ?? [])),
});

export const RootConfig = new InjectionToken('RootConfiguration', {
  providedIn: 'root',
  factory: () =>
    deepMerge({}, ...(inject(ConfigChunk, InjectFlags.Optional) ?? [])),
});

/**
 * Config chunk token, can be used to provide configuration chunk and contribute to the global configuration object.
 * Should not be used directly, use `provideConfig` or import `ConfigModule.withConfig` instead.
 */
export const ConfigChunk = new InjectionToken<object[]>('ConfigurationChunk');
/**
 * Config chunk token, can be used to provide configuration chunk and contribute to the default configuration.
 * Should not be used directly, use `provideDefaultConfig` or `provideDefaultConfigFactory` instead.
 *
 * General rule is, that all config provided in libraries should be provided as default config.
 */
export const DefaultConfigChunk = new InjectionToken<object[]>(
  'DefaultConfigurationChunk'
);

/**
 * Factory function that merges all configurations chunks. Should not be used directly without explicit reason.
 */
export function configurationFactory(
  configChunks: any[] = [],
  defaultConfigChunks: any[] = []
) {
  const config = deepMerge(
    {},
    ...(defaultConfigChunks ?? []),
    ...(configChunks ?? [])
  );
  return config;
}

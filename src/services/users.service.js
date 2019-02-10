import http from '@/http';

export function getAll() {
  return http().get('users');
}
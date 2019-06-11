import http from '@/http'

export function getAll() {
  return http().get('organizations');
}

export function getById(id) {
  return http().get('organizations/' + id);
}
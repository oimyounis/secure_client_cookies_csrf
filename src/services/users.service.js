import http from '@/http';

export function getAll() {
  return http().post('users');
}

export function getById(id) {
  return http().get('organizations/'+id);
}
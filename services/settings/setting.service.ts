import { SettingRepository } from "@/repositories/setting.repository";

export class SettingService {
  static async getAll() {
    return SettingRepository.getAll();
  }

  static async getByKey(key: string) {
    return SettingRepository.getByKey(key);
  }

  static async updateMany(settings: { key: string; value: string; group?: string }[]) {
    return SettingRepository.updateMany(settings);
  }

  static async upsert(key: string, value: string, group?: string) {
    return SettingRepository.upsert(key, value, group);
  }
}

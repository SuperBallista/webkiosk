import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number; // 기본키

  @Column()
  user_id: string; // 사용자 ID

  @Column()
  img_id: string; // 사진 ID

  @Column()
  src: string; // Cloudinary URL

  @Column()
  title: string; // 파일 이름
}

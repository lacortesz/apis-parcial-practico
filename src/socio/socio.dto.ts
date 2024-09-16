/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class SocioDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly correoElectronico: string;
 
 @IsString()
 @IsNotEmpty()
 readonly fechaNacimiento: string;
 
}
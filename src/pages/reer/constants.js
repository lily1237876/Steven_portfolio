import {Color} from "three";

export const divisionCount_init = 100;
export const divisionCount_result = divisionCount_init + 1; // b/c using curve.getSpacedPoints(n) returns (n + 1) points

export const chairColor = new Color(0xDAFF45);
export const backgroundColor = new Color(0x272727);

export const globalScale = 0.1;

export const percentage_blur = 0.01;
export const draw_points_start_percentage = percentage_blur;
export const draw_points_end_percentage = 1 / 3 + percentage_blur;

export const draw_full_mesh_start_percentage = 1 / 3 - percentage_blur;
export const draw_full_mesh_end_percentage = 2 / 3 + percentage_blur;

export const draw_explosion_start_percentage = 2 / 3 + percentage_blur;
export const draw_explosion_end_percentage = 1 - percentage_blur;
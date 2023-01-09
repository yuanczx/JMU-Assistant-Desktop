//不显示命令行窗口
#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri;

#[tauri::command]
fn show_info(info: &str) {
    println!("Info:{info}")
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![show_info])
        .run(tauri::generate_context!())
        .expect("Error");
}


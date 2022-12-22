import subprocess

program_list = ["harvest.py", "convert_all_txt_cities_to_json.py", "build_fr_sentences.py"]
for program in program_list:
    subprocess.call(['python', f"data_build/{program}"])
    print("Finished:" + program)
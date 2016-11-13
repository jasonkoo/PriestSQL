package com.lenovo.priestsql.web.utils;

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.time.FastDateFormat;
import org.apache.log4j.Logger;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.support.JdbcUtils;

import com.lenovo.priestsql.ContextServer;
import com.lenovo.priestsql.PriestSqlConfiguration;

public class FileWriterUtil {

	private static Logger logger = Logger.getLogger(FileWriterUtil.class);

	private static final String PATH = ContextServer
			.getInstance()
			.getConfig()
			.get(PriestSqlConfiguration.FILE_SAVE_PATH,
					PriestSqlConfiguration.FILE_SAVE_PATH_DEFAULT);

	@SuppressWarnings("unchecked")
	public static String writeFile(List<Object> list, String key) {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String datePath = sdf.format(date);
		File dateFile = new File(PATH + "/" + datePath);
		if (!dateFile.exists() && !dateFile.isDirectory()) {
			dateFile.mkdir();
		}
		File file = new File(PATH + "/" + datePath + "/" + key + ".csv");
		if (list.size() == 0) {
			return file.getAbsolutePath();
		}
		List<String> fields = new ArrayList<String>(
				((HashMap<String, String>) list.get(0)).keySet());
		try {
			FileOutputStream fos = new FileOutputStream(file);
			FileChannel outputChannle=fos.getChannel();
			ByteBuffer buffer = ByteBuffer.allocateDirect (64 * 1024);
			// 写入文件头
			StringBuffer header = new StringBuffer();
			for (String field : fields) {
				header.append(field).append("\001");
			}
			header.deleteCharAt(header.length() - 1).append("\r\n");
			buffer.put(header.toString().getBytes("UTF-8")).flip();
			outputChannle.write(buffer);
			buffer.compact();

			for (Object obj : list) {
				StringBuffer sb = new StringBuffer();
				HashMap<String, Object> hm = (HashMap<String, Object>) obj;
				for (String field : fields) {
					sb.append(hm.get(field) + "").append("\001");

				}
				sb.deleteCharAt(sb.length() - 1).append("\r\n");
				buffer.put(sb.toString().getBytes("UTF-8")).flip();
				outputChannle.write(buffer);
				buffer.compact();
			}

			outputChannle.close();

			fos.close();
			fos = null;
		} catch (Exception e) {
			logger.error(e, e);
		}
		return file.getAbsolutePath();
	}

	public static String getLocalPath() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String datePath = sdf.format(date);
		File dateFile = new File(PATH + "/" + datePath);
		if (!dateFile.exists() && !dateFile.isDirectory()) {
			dateFile.mkdir();
		}
		return PATH + "/" + datePath + "/";
	}

	@SuppressWarnings("unchecked")
	public static String writeExcel(List<Object> list, String key) {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String datePath = sdf.format(date);
		File dateFile = new File(PATH + "/" + datePath);
		if (!dateFile.exists() && !dateFile.isDirectory()) {
			dateFile.mkdir();
		}
		File file = new File(PATH + "/" + datePath + "/" + key + ".xlsx");
		if (list.size() == 0) {
			return file.getAbsolutePath();
		}
		OutputStream os = null;
		try {
			os = new FileOutputStream(file);
			String sheetName = "sheet1";
			List<String> headers = new ArrayList<String>(
					((HashMap<String, String>) list.get(0)).keySet());
			writeExcel(sheetName, headers, list, os);
		} catch (Exception e) {
			logger.error(e, e);
		} finally {
			if (os != null) {
				try {
					os.close();
				} catch (IOException e) {
					logger.error(e, e);
				}
			}
		}
		return file.getAbsolutePath();
	}

	@SuppressWarnings("unchecked")
	public static void writeExcel(String sheetName, List<String> headers,
			List<Object> table, OutputStream os) throws IOException {
		XSSFWorkbook workbook = new XSSFWorkbook();
		try {
			XSSFSheet sheet = workbook.createSheet(sheetName);
			// 生成header样式
			XSSFCellStyle hdStyle = workbook.createCellStyle();
			hdStyle.setFillForegroundColor(new XSSFColor(new Color(0, 162, 232)));
			hdStyle.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
			hdStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
			hdStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
			hdStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
			hdStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
			hdStyle.setAlignment(XSSFCellStyle.ALIGN_CENTER);
			// 生成一个字体
			XSSFFont font = workbook.createFont();
			font.setColor(new XSSFColor(new Color(0, 0, 0)));
			font.setFontHeightInPoints((short) 12);
			font.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
			// 把字体应用到当前的样式
			hdStyle.setFont(font);
			// 产生表格标题行
			sheet.setDefaultColumnWidth(20);
			XSSFRow rowHeader = sheet.createRow(0);
			for (int i = 0; i < headers.size(); i++) {
				XSSFCell cell = rowHeader.createCell(i);
				cell.setCellStyle(hdStyle);
				String strs[] = headers.get(i).split("\\.");
				XSSFRichTextString text = new XSSFRichTextString(
						strs.length > 1 ? strs[1] : strs[0]);
				cell.setCellValue(text);
			}
			// 表格内容样式
			XSSFCellStyle style = workbook.createCellStyle();
			style.setFillForegroundColor(new XSSFColor(new Color(255, 255, 255)));
			style.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
			style.setBorderBottom(XSSFCellStyle.BORDER_THIN);
			style.setBorderLeft(XSSFCellStyle.BORDER_THIN);
			style.setBorderRight(XSSFCellStyle.BORDER_THIN);
			style.setBorderTop(XSSFCellStyle.BORDER_THIN);
			style.setAlignment(XSSFCellStyle.ALIGN_CENTER);
			style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);
			style.setWrapText(true);
			// 遍历集合数据，产生数据行
			FastDateFormat format = FastDateFormat.getInstance("yyyy-MM-dd");
			int rowIndex = 1;
			for (Object objects : table) {
				HashMap<String, String> hm = (HashMap<String, String>) objects;
				XSSFRow row = sheet.createRow(rowIndex++);
				for (int i = 0; i < headers.size(); i++) {
					Object value = hm.get(headers.get(i));
					String cellValue = null;
					if (value == null) {
						cellValue = "";
					} else if (value instanceof Date) {
						cellValue = format.format(value);
					} else {
						cellValue = value.toString();
					}
					XSSFCell cell = row.createCell(i);
					cell.setCellStyle(style);
					cell.setCellValue(cellValue);
				}
			}
			workbook.write(os);
		} catch (Exception e) {
			logger.error(e, e);
		} finally {
			workbook.close();
		}
	}
	
	public static String writeFile(ResultSet rs, String key) {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String datePath = sdf.format(date);
		File dateFile = new File(PATH + "/" + datePath);
		if (!dateFile.exists() && !dateFile.isDirectory()) {
			dateFile.mkdir();
		}
		File file = new File(PATH + "/" + datePath + "/" + key + ".csv");
		try {
			List<String> fields = new ArrayList<String>();
			List<String> values = new ArrayList<String>();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
			if (rs.next()) {
				for (int i = 1; i <= columnCount; i++) {
					fields.add(JdbcUtils.lookupColumnName(rsmd, i));
					values.add(JdbcUtils.getResultSetValue(rs, i) + "");
				}
			} else {
				return file.getAbsolutePath();
			}

			FileOutputStream fos = new FileOutputStream(file);
			FileChannel outputChannle=fos.getChannel();
			//设置缓冲区大小，需要大于一行的数据所需空间
			ByteBuffer buffer = ByteBuffer.allocateDirect (64 * 1024);
			// 写入文件头
			StringBuilder header = new StringBuilder();
			for (String field : fields) {
				header.append(field).append("\001");
			}
			header.deleteCharAt(header.length() - 1).append("\r\n");
			buffer.put(header.toString().getBytes("UTF-8")).flip();
			outputChannle.write(buffer);
			buffer.compact();
			
			// 写入因为要取文件头而获取的第一行数据
			StringBuilder line1 = new StringBuilder();
			for (String value : values) {
				line1.append(value).append("\001");
			}
			line1.deleteCharAt(line1.length() - 1).append("\r\n");
			buffer.put(line1.toString().getBytes("UTF-8")).flip( );
			outputChannle.write(buffer);
			buffer.compact();

			// 写入剩下的数据
			StringBuilder sb=new StringBuilder();
			while (rs.next()) {
				sb.setLength(0);
				for (int i = 1; i <= columnCount; i++) {
					sb.append(JdbcUtils.getResultSetValue(rs, i) + "").append("\001");
				}
				sb.deleteCharAt(sb.length() - 1).append("\r\n");
				buffer.put(sb.toString().getBytes("UTF-8")).flip();
				outputChannle.write(buffer);
				buffer.compact();
			}

			outputChannle.close();
			
			fos.close();
			fos = null;
		} catch (Exception e) {
			logger.error(e, e);
		}finally{
			System.gc();
		}
		return file.getAbsolutePath();

	}
}
